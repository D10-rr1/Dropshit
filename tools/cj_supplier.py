"""Find the Emberwell hand warmer on CJdropshipping and pull its supplier data.

Uses CJ's official API (https://developers.cjdropshipping.com). Needs your CJ API key:
    export CJ_API_KEY="..."   # CJ dashboard -> Authorization -> API -> Generate key

Usage:
    python3 tools/cj_supplier.py search                # list candidate products
    python3 tools/cj_supplier.py details <pid>         # variants, cost, US shipping options
    python3 tools/cj_supplier.py images <pid>          # download supplier photos to site/img/product/
"""
import json, os, pathlib, sys, urllib.parse, urllib.request

API = "https://developers.cjdropshipping.com/api2.0/v1"
ROOT = pathlib.Path(__file__).resolve().parent.parent
KEYWORDS = ["magnetic hand warmer", "split hand warmer", "rechargeable hand warmer"]


def call(path, token=None, body=None, method=None):
    headers = {"Content-Type": "application/json"}
    if token:
        headers["CJ-Access-Token"] = token
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(API + path, data=data, headers=headers, method=method or ("POST" if data else "GET"))
    with urllib.request.urlopen(req, timeout=60) as r:
        res = json.load(r)
    if not res.get("result"):
        sys.exit(f"CJ API error on {path}: {res.get('message')}")
    return res["data"]


def token():
    key = os.environ.get("CJ_API_KEY")
    if not key:
        sys.exit("Set CJ_API_KEY first (see top of this file).")
    return call("/authentication/getAccessToken", body={"apiKey": key})["accessToken"]


def search(tok):
    seen = {}
    for kw in KEYWORDS:
        q = urllib.parse.quote(kw)
        data = call(f"/product/list?productNameEn={q}&pageNum=1&pageSize=50", tok)
        for p in data.get("list", []):
            seen.setdefault(p["pid"], p)
    rows = sorted(seen.values(), key=lambda p: -(p.get("listedNum") or 0))
    for p in rows:
        print(f'{p["pid"]}  ${p.get("sellPrice")}  listed:{p.get("listedNum", 0):>5}  {p["productNameEn"][:90]}')


def details(tok, pid):
    p = call(f"/product/query?pid={pid}", tok)
    print(p["productNameEn"])
    print("Weight (g):", p.get("productWeight"), "| Category:", p.get("categoryName"))
    for v in p.get("variants", []):
        print(f'  variant {v["vid"]}  ${v.get("variantSellPrice")}  {v.get("variantKey") or v.get("variantNameEn")}')
    vid = p["variants"][0]["vid"]
    for qty in (1, 2, 4):
        opts = call("/logistic/freightCalculate", tok, {
            "startCountryCode": "CN", "endCountryCode": "US",
            "products": [{"quantity": qty, "vid": vid}],
        })
        best = sorted(opts, key=lambda o: o["logisticPrice"])[:4]
        print(f"  US shipping for qty {qty}:", "; ".join(f'{o["logisticName"]} ${o["logisticPrice"]} ({o["logisticAging"]} days)' for o in best))


def images(tok, pid):
    p = call(f"/product/query?pid={pid}", tok)
    urls = p.get("productImageSet") or json.loads(p.get("productImage") or "[]")
    out = ROOT / "site" / "img" / "product"
    out.mkdir(parents=True, exist_ok=True)
    for i, url in enumerate(urls, 1):
        ext = pathlib.Path(urllib.parse.urlparse(url).path).suffix or ".jpg"
        dest = out / f"{i:02d}{ext}"
        urllib.request.urlretrieve(url, dest)
        print("saved", dest.relative_to(ROOT))


if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    tok = token()
    cmd = sys.argv[1]
    if cmd == "search":
        search(tok)
    elif cmd == "details":
        details(tok, sys.argv[2])
    elif cmd == "images":
        images(tok, sys.argv[2])
    else:
        sys.exit(__doc__)
