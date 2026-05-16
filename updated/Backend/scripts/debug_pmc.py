import requests, re
from lxml import html

r = requests.get(
    'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10725812/',
    headers={'User-Agent': 'Mozilla/5.0'},
    timeout=15
)
tree = html.fromstring(r.content)

# Find main article body — skip nav/header
article = tree.xpath('//article') or tree.xpath('//*[@role="main"]') or tree.xpath('//div[@class="article"]')
root = article[0] if article else tree
print('Using root:', root.tag, root.get('class','')[:40])

# Find all sections with their h2/h3 and paragraphs
sections = root.xpath('.//section')
print(f'\nTotal sections: {len(sections)}')

# Show first Recommendations section content
for sec in sections:
    h3 = sec.xpath('.//h3')
    if h3 and 'Recommendation' in h3[0].text_content():
        print('\n--- RECOMMENDATIONS SECTION ---')
        print('H3:', h3[0].text_content().strip())
        # Get all list items and paragraphs in this section
        items = sec.xpath('.//li | .//p')
        for item in items[:8]:
            t = item.text_content().strip()
            if t and len(t) > 20:
                print(' TEXT:', t[:200])
        break

# Check how rec numbers look — find paragraphs starting with N.N pattern
all_p = root.xpath('.//p')
print('\n--- PARAGRAPHS WITH REC NUMBERS ---')
rec_re = re.compile(r'^\s*\d+\.\d+[a-z]?\s+\w')
count = 0
for p in all_p:
    t = p.text_content().strip()
    if rec_re.match(t):
        print(' REC:', t[:200])
        count += 1
        if count >= 5:
            break

# Show structure of first H2 section
print('\n--- FIRST H2 SECTION STRUCTURE ---')
h2_secs = root.xpath('.//section[.//h2]')
if h2_secs:
    sec = h2_secs[0]
    print('H2:', sec.xpath('.//h2')[0].text_content().strip()[:60])
    children = list(sec)
    print('Direct children tags:', [c.tag for c in children[:10]])
