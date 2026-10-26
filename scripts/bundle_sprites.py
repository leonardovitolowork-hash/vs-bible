import hashlib, io, json, os, re, subprocess, time, unicodedata
from pathlib import Path
from urllib.parse import urlencode
from urllib.request import Request, urlopen
from PIL import Image
ROOT = Path('.')
OUT = ROOT / 'assets/sprites'
OUT.mkdir(parents=True, exist_ok=True)
UA = 'VS-Bible-static-sprite-bundler/1.0 (https://github.com/leonardovitolowork-hash/vs-bible)'
def get(url):
    error = None
    for attempt in range(4):
        try:
            with urlopen(Request(url, headers={'User-Agent': UA}), timeout=40) as r:
                return r.read()
        except Exception as exc:
            error = exc
            time.sleep(2 ** (attempt + 1))
    raise RuntimeError(str(error))
def norm(text):
    return re.sub(r'[^a-z0-9]', '', unicodedata.normalize('NFKD', text).encode('ascii', 'ignore').decode().lower())
source = get('https://raw.githubusercontent.com/leonardovitolowork-hash/vs-bible/81e67dc14ecbc361b4a2d047669e4b46cd8e0454/data.js').decode()
js = "const vm=require('vm'),fs=require('fs');process.stdout.write(vm.runInNewContext(fs.readFileSync(0,'utf8')+';JSON.stringify(E)'));"
entries = json.loads(subprocess.check_output(['node', '-e', js], input=source.encode()))
wanted = {}
for entry in entries:
    if entry['c'] in ['Characters', 'Weapons', 'Passives', 'Evolutions']:
        wanted[entry.get('w') or entry['n']] = entry['c']
for entry in entries:
    if entry['c'] == 'Evolutions':
        for name in entry.get('s', '').split(' + '):
            wanted.setdefault(name, 'Weapons')
catalog = {}
api_used = None
for api in ['https://vampire.survivors.wiki/api.php', 'https://vampire.survivors.wiki/w/api.php']:
    try:
        probe = json.loads(get(api + '?' + urlencode({'action':'query','format':'json','list':'allimages','aiprefix':'Sprite-','ailimit':1,'aiprop':'url|mime|size'})))
        if probe.get('query', {}).get('allimages'):
            api_used = api
            break
    except Exception:
        pass
if not api_used:
    raise RuntimeError('Wiki API could not be reached. No app files changed; rerun this job later.')
for prefix in ['Sprite-', 'Icon-']:
    params = {'action':'query','format':'json','list':'allimages','aiprefix':prefix,'ailimit':500,'aiprop':'url|mime|size'}
    for page in range(30):
        data = json.loads(get(api_used + '?' + urlencode(params)))
        if 'error' in data:
            raise RuntimeError(str(data['error']))
        for image in data.get('query', {}).get('allimages', []):
            name = image['name']
            if name.lower().endswith('.png') and image.get('mime') == 'image/png':
                label = name[len(prefix):-4].replace('_', ' ')
                catalog.setdefault((prefix, norm(label)), image)
        if 'continue' not in data:
            break
        params.update(data['continue'])
        time.sleep(1)
aliases = {'Mask of the Red Death':['Red Death'], 'missingN▯':['missingNo','missingN'], 'Exdash Exiviiq':['Exdash'], 'Iguana Gallo Valletto':['Gallo'], 'Divano Thelma':['Divano'], "O'Sole Meeo":["O'Sole"], "Zi'Assunta Belpaese":["Zi'Assunta"], "Zi'Appunta Belpaese":["Zi'Appunta"]}
mapping, provenance, missing = {}, {}, []
for name, category in sorted(wanted.items()):
    candidates = [name] + aliases.get(name, [])
    if category == 'Characters':
        candidates += [name.split(' ')[0]]
    image = None
    for prefix in ['Sprite-', 'Icon-']:
        for candidate in candidates:
            image = catalog.get((prefix, norm(candidate)))
            if image:
                break
        if image:
            break
    if not image:
        missing.append(name)
        continue
    try:
        raw = get(image['url'])
        with Image.open(io.BytesIO(raw)) as pic:
            if pic.format != 'PNG' or getattr(pic, 'n_frames', 1) != 1:
                raise ValueError('Not a static PNG')
            pic.load()
            path = OUT / (hashlib.sha256(name.encode()).hexdigest()[:20] + '.png')
            pic.convert('RGBA').save(path, optimize=True)
        mapping[name] = path.as_posix()
        provenance[name] = {'file':image['name'], 'url':image['url']}
        time.sleep(.25)
    except Exception as exc:
        missing.append(name + ': ' + str(exc))
report = {'requested':len(wanted), 'downloaded':len(mapping), 'missing':missing, 'sources':provenance}
(OUT / 'report.json').write_text(json.dumps(report, ensure_ascii=False, indent=2))
summary = os.environ.get('GITHUB_STEP_SUMMARY')
if summary:
    with open(summary, 'a') as f:
        f.write('# Static sprite validation\nDownloaded '+str(len(mapping))+' / '+str(len(wanted))+'\n\n'+('\n'.join('- '+n for n in missing) or 'All required sprites validated.'))
if missing:
    raise RuntimeError('Unresolved sprites; publishing stopped to avoid another incomplete fix: ' + ', '.join(missing))
app = Path('app.js').read_text()
old = "const spriteURL=name=>'https://vampire.survivors.wiki/w/Special:FilePath/'+encodeURIComponent('Sprite-'+name+'.png');"
replacement = 'const LOCAL_SPRITES=' + json.dumps(mapping, ensure_ascii=False) + ';\nconst spriteURL=name=>LOCAL_SPRITES[name]||\'\';'
if old in app:
    app = app.replace(old, replacement, 1)
elif 'const LOCAL_SPRITES=' in app:
    app = re.sub(r'const LOCAL_SPRITES=.*?;\nconst spriteURL=.*?;', lambda m: replacement, app, count=1)
else:
    raise RuntimeError('App changed: sprite function not found. No app files changed.')
app = app.replace("new Set(['Weapons','Evolutions','Passives','Grimoire'])", "new Set(['Characters','Weapons','Evolutions','Passives','Grimoire'])", 1)
Path('app.js').write_text(app)
sw = Path('sw.js').read_text()
sw = re.sub(r"const V='[^']+';", "const V='vs-local-sprites-1';", sw, count=1)
extra = sorted(set(mapping.values()))
sw, count = re.subn(r'const FILES=\[.*?\];', lambda m: 'const FILES=' + json.dumps(['./','index.html','app.js?recovery=1','manifest.webmanifest','icon.svg','icon-192.png','icon512-.png','apple-touch-icon.png','demi-and-leo.png'] + extra) + ';', sw, count=1)
if count != 1:
    raise RuntimeError('Service worker layout changed; publishing stopped.')
Path('sw.js').write_text(sw)
(OUT / 'manifest.json').write_text(json.dumps(mapping, ensure_ascii=False, indent=2))
print('Validated and installed', len(mapping), 'static PNGs.')
