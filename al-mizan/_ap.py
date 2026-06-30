import http.server,socketserver,threading,functools,os,datetime,json
from playwright.sync_api import sync_playwright
os.chdir(os.path.dirname(os.path.abspath(__file__)))
P=8791;socketserver.TCPServer.allow_reuse_address=True
httpd=socketserver.TCPServer(("127.0.0.1",P),functools.partial(http.server.SimpleHTTPRequestHandler));threading.Thread(target=httpd.serve_forever,daemon=True).start()
t=datetime.date.today();d=lambda n:t-datetime.timedelta(days=n)
iso=lambda n,h=9:datetime.datetime.combine(d(n),datetime.time(h,12)).isoformat();key=lambda n:d(n).strftime("%Y-%m-%d")
vals=[(2,2,3,2,["fatigue"]),(3,3,3,3,[]),(4,4,4,4,[]),(3,4,3,4,[]),(2,2,2,1,["fatigue"]),(4,5,4,5,[]),(3,3,4,3,[])]
ch=[{"id":"c"+str(i),"cree":iso(len(vals)-1-i),"date":key(len(vals)-1-i),"energie":e,"humeur":h,"clarte":c,"elan":el,"zones":z,"note":""} for i,(e,h,c,el,z) in enumerate(vals)]
seed=f"localStorage.setItem('almizan.v1.checkins',{json.dumps(json.dumps(ch))});localStorage.setItem('almizan.v1.prefs','{{\"prenom\":\"Nawel\",\"spirituel\":true,\"onboarded\":true}}');"
C="/opt/pw-browsers/chromium-1194/chrome-linux/chrome";b0=f"http://127.0.0.1:{P}/index.html"
with sync_playwright() as p:
 b=p.chromium.launch(executable_path=C);pg=b.new_page(viewport={"width":412,"height":760},device_scale_factor=2);pg.add_init_script(seed)
 pg.goto(b0+"#/accueil",wait_until="networkidle");pg.wait_for_timeout(1700);pg.screenshot(path="jost.png")
 b.close()
print("done")
