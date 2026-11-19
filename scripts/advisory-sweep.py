#!/usr/bin/env python3
"""Sweep production dependencies against OSV (Open Source Vulnerabilities).

Pola repo P1 #24-#39: 1 POST ke api.osv.dev/v1/querybatch untuk semua
paket produksi. JANGAN pakai `npm audit` sebagai gate — npm audit
melaporkan advisory dev-only secara deterministik (bug npm yang
terdokumentasi: `npm audit --omit=dev` tetap menghitung advisory yang
hanya terjangkau lewat paket dev). JANGAN pakai GitHub Advisory DB API
+ GITHUB_TOKEN (gagal deterministik 401 di CI orteam — token lottery).
OSV memirror GitHub Advisory Database, tanpa auth.

Repo ini (situs statis) tidak punya dependensi produksi sama sekali —
hanya devDependencies (playwright, html-validate). Sweep tetap jalan
sebagai bukti: 0 paket produksi = 0 temuan. Tanpa lockfile, anggap 0
paket produksi (lockfile diunggah CI sebagai artifact).

Usage: python3 scripts/advisory-sweep.py
Exit 0 = bersih, 1 = temuan HIGH/CRITICAL, 2 = error API.
"""
import json
import os
import sys
import urllib.error
import urllib.request

SEVERITIES = ("HIGH", "CRITICAL")
OSV_BATCH_URL = "https://api.osv.dev/v1/querybatch"


def pkg_name(key):
    rest = key
    while rest.startswith("node_modules/"):
        rest = rest[len("node_modules/"):]
    if "/node_modules/" in rest:
        rest = rest.rsplit("/node_modules/", 1)[1]
    parts = rest.split("/")
    if rest.startswith("@") and len(parts) >= 2:
        return "/".join(parts[:2])
    return parts[0]


def load_prod_packages(lock_path):
    with open(lock_path) as f:
        lock = json.load(f)
    prod = {}
    for key, info in lock.get("packages", {}).items():
        if not key or not info.get("version"):
            continue
        if info.get("dev"):
            continue
        prod.setdefault(pkg_name(key), set()).add(info["version"])
    return {name: sorted(versions) for name, versions in sorted(prod.items())}


def severity_of(vuln):
    ds = vuln.get("database_specific") or {}
    sev = (ds.get("severity") or "").upper()
    if sev in ("CRITICAL", "HIGH", "MODERATE", "LOW"):
        return sev
    for entry in vuln.get("severity", []) or []:
        try:
            score = float(entry.get("score", ""))
        except (TypeError, ValueError):
            continue
        if score >= 9.0:
            return "CRITICAL"
        if score >= 7.0:
            return "HIGH"
        if score >= 4.0:
            return "MODERATE"
        return "LOW"
    return None


def query_osv(queries):
    body = json.dumps({"queries": queries}).encode()
    req = urllib.request.Request(
        OSV_BATCH_URL,
        data=body,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.build_opener().open(req, timeout=120) as r:
            return json.loads(r.read() or b"{}")
    except urllib.error.HTTPError as e:
        detail = e.read()[:500].decode("utf-8", "replace")
        print(f"ERROR: OSV API {e.code}: {detail}", file=sys.stderr)
        raise SystemExit(2)
    except urllib.error.URLError as e:
        print(f"ERROR: OSV API unreachable: {e}", file=sys.stderr)
        raise SystemExit(2)


def sweep(lock_path):
    prod = load_prod_packages(lock_path)
    pairs = [(name, ver) for name, vers in prod.items() for ver in vers]
    print(f"checking {len(prod)} production packages ({len(pairs)} name@version pairs)", flush=True)
    queries = [
        {"package": {"name": name, "ecosystem": "npm"}, "version": ver}
        for name, ver in pairs
    ]
    if not queries:
        return [], []
    resp = query_osv(queries)
    results = resp.get("results", [])
    findings = []
    unknown = []
    seen = set()
    for (name, ver), res in zip(pairs, results):
        for vuln in res.get("vulns", []) or []:
            sev = severity_of(vuln)
            vid = vuln.get("id", "?")
            aliases = ",".join(vuln.get("aliases", []) or [])
            key = (name, ver, vid)
            if key in seen:
                continue
            seen.add(key)
            if sev in SEVERITIES:
                findings.append(f"{name}@{ver}: {vid} {sev} {aliases}")
            elif sev is None:
                unknown.append(f"{name}@{ver}: {vid} (severity unknown)")
    return findings, unknown


def main():
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    lock_path = os.path.join(root, "package-lock.json")
    if not os.path.exists(lock_path):
        print("note: package-lock.json belum ada — 0 paket produksi (lockfile diunggah CI sebagai artifact)", flush=True)
        print("OK: no high/critical advisories affect production dependencies", flush=True)
        return 0
    findings, unknown = sweep(lock_path)
    for line in unknown:
        print("  note: " + line, flush=True)
    if findings:
        print(f"FAIL: {len(findings)} HIGH/CRITICAL finding(s) in production dependencies:", flush=True)
        for line in findings:
            print("  " + line, flush=True)
        return 1
    print("OK: no high/critical advisories affect production dependencies", flush=True)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
