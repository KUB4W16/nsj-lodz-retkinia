from flask import Flask, render_template, Response, request
from graphqlclient import GraphQLClient
from bs4 import BeautifulSoup
import json, datetime, os, requests, re
import difflib

from dotenv import load_dotenv
load_dotenv('.env')

app = Flask(__name__);
app.static_folder = 'static'

COUNTER = 318782

client = GraphQLClient('https://api-eu-central-1.graphcms.com/v2/ckgi1a7duu2pu01xp02w993pr/master')
client.inject_token('Bearer ' + os.environ.get("GRAPHCMS_AUTH"))

basic_routes = {
    "/kancelaria": ["office", "kancelaria"],
    "/cmentarz": ["cementary", "cmentarz"],
    "/msze-swiete": ["mass", "msze"],
    "/sakramenty": ["sacraments", "sakramenty"],
    "/kaplani": ["priests", "kaplani"],
    "/informacje": ["info", "informacje"],
    "/ministranci": ["acolyte", "ministranci"],
    "/najswietsze-serce-jezusa": ["nsj", "nsj"],
    "/polecane-strony": ["pages","strony"],
    "/galeria": ["galery", "galeria"],
    "/wspolnoty-parafialne": ["groups", "wspolnoty"]
}

placeholder = '<article_type>'
basic_query = '''
{
  articles(last: 1, where: {articleType: <article_type> } ) {
    title
    content {
        html
    }
    image {
      url
      fileName
    }
    date
  }
}
'''

def get_album(_id):
    r = requests.get("https://photos.app.goo.gl/{}".format(_id))
    links_regex = r'\[\"(https:\/\/lh3\.googleusercontent\.com\/[a-zA-Z0-9\-_]*)\"'
    matches = re.findall(links_regex, r.text)
    links = list(set(matches))
    soup = BeautifulSoup(r.text)
    title = soup.find_all("div", {"class": "cL5NYb"})[0].text

    return {"title": title, 'images': links}

@app.route('/')
def default():
    global COUNTER
    query= '''
{
  announcements(orderBy:date_DESC, first:5){
    date
    content
    image {
      url
    }
  }
}
    '''
    res = json.loads(client.execute(query))['data']
    COUNTER += 1
    return render_template('index.html', articles=res['announcements'], counter=COUNTER, url=request.url, printable=True)

@app.route('/ogloszenia/ostatnie')
def lates_announcements():
    global COUNTER
    query= '''
{
  announcements(orderBy:date_DESC, first:5){
    date
    content
    image {
      url
    }
  }
}
    '''
    res = json.loads(client.execute(query))['data']
    return render_template('index.html', articles=res['announcements'], counter=COUNTER, url=request.url, printable=True)

@app.route('/aktualnosci')
def news():
    query = '''
{
  articles(orderBy: date_DESC, last: 15, where: {articleType: aktualnosci}) {
    title
    content {
        html
    }
    image {
      url
      fileName
    }
    date
  }
}
    '''
    res = json.loads(client.execute(query))['data']
    return render_template('index.html', articles=res['articles'], counter=COUNTER, url=request.url, printable=True)

def _generative():
    article_type = basic_routes[request.url_rule.rule][1]
    query = basic_query.replace(placeholder, article_type)
    res = json.loads(client.execute(query))['data']
    printable = True
    if article_type in ['kaplani', 'strony', 'galeria']:
        printable = False
    return render_template('index.html', articles=res['articles'], counter=COUNTER, url=request.url, printable=printable)

for route in basic_routes:
    app.add_url_rule(route, route[0], _generative)

@app.route('/wspolnoty-parafialne/<_type>')
def group(_type):
    query = '''
{
  groupDescriptions(last: 1, where: { groupType: %s }) {
    title
    content {
        html
    }
    image {
      url
      fileName
    }
    date
  }
}
    ''' % (_type)
    res = json.loads(client.execute(query))['data']
    return render_template('index.html', articles=res['groupDescriptions'], counter=COUNTER, url=request.url, printable=True)

@app.route('/galeria/<_id>')
def album(_id):
    album_data = get_album(_id)
    return render_template('gallery.html', counter=COUNTER, albumId=_id, title=album_data['title'], images=album_data['images'], url=request.url)

@app.route('/sitemap.xml')
def get_sitemap():
    return Response(open('static/sitemap.xml').read(), mimetype='text/xml')

@app.route('/drukuj')
def print_announcement():
    date = request.args.get('data')
    article_type = request.args.get('artykul')

    if article_type == "ogloszenia":
        query= '''
{
  announcements(orderBy:date_DESC, first:5, where: {date: "%s"}){
    date
    title
    content
    image {
      url
      fileName
    }
  }
}
    ''' % (date)
    else:
        query = '''
{
  articles(orderBy: date_DESC, last: 5, where: {articleType: %s, date: "%s"}) {
    title
    articleType
    content {
        html
    }
    image {
      url
      fileName
    }
    date
  }
}
    ''' % (article_type, date)
    res = json.loads(client.execute(query))['data']
    if 'articles' in res.keys():
        res['articles']
    elif 'announcements' in res.keys():
        res = {"articles": res['announcements']}
    return render_template('print.html', articles=res, counter=COUNTER)

@app.route('/szukaj')
def search():
    if request.args['typ'] == 'ogloszenia':
        article_type = 'announcements'
    else:
        article_type = 'articles';

    date = request.args['data'] if 'data' in request.args.keys() else None
    phrase = request.args['fraza'] if 'fraza' in request.args.keys() else None
    limit = request.args['limit'] if 'limit' in request.args.keys() else 10
    date_str = 'date: "'+date+'" ' if date else ''
    article_type_str = 'articleType: aktualnosci ' if request.args['typ'] == 'aktualnosci' else ''

    where_str = f', where: {{{date_str+article_type_str}}}'

    query = f'''
{{
    {article_type}(orderBy: date_DESC, first: {limit}{where_str}) {{
      title
      content {"{ html }" if article_type != 'announcements' else ''}
      image {{
        url
        fileName
      }}
      date
    }}
}}
    '''
    res = json.loads(client.execute(query))['data']
    new_res = {
        article_type: []
    }
    if phrase is not None:
        tokenized_phrase = phrase.lower().split(' ')
        stopwords = json.loads(open('stopwords-pl.json', encoding='utf-8').read())
        for article in res[article_type]:
            if article_type == "announcements":
                _soup = BeautifulSoup(article['content'])
                for script in _soup(["script", "style"]):
                    script.decompose()
                texts_list = list(_soup.stripped_strings)
            else:
                _soup = BeautifulSoup(article['content']['html'])
                for script in _soup(["script", "style"]):
                    script.decompose()
                texts_list = list(_soup.stripped_strings)

                tokenized_text = list(filter(None, [re.sub(r"[^a-zA-Z0-9 ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]", "", p.lower()) for p in " ".join(texts_list).split(" ") if p.lower() not in stopwords]))
                tokenized_phrases_from_text = []

                for i in range(tokenized_text.__len__()):
                    # print(' '.join(tokenized_text[i:i+tokenized_phrase.__len__()]))
                    tokenized_phrases_from_text += [' '.join(tokenized_text[i:i+tokenized_phrase.__len__()])]

                _cutoff = 0.8
                diff = difflib.get_close_matches(phrase, tokenized_phrases_from_text, cutoff=_cutoff)
                print(tokenized_phrases_from_text)
                print(diff)
                if diff != []:
                    new_res[article_type].append(article)
                # elif diff == []:
                #     new_res[article_type].append('');
    if new_res[article_type] == []:
        return render_template('index.html', articles=res[article_type], counter=COUNTER, url=request.url, printable=True)
    else:
        return render_template('index.html', articles=new_res[article_type], counter=COUNTER, url=request.url, printable=True)

@app.errorhandler(Exception)
def page_not_found(e):
    articles = [
      {
        "title": "Coś poszło nie tak.",
        "content": {
          "html":
            "<p>Strona, której szukasz nie została znaleziona. <a class='link' href='/'>Wróć do strony głównej</a></p>",
        },
        "date": datetime.datetime.now().strftime('%d-%m-%Y'),
        "image": {
          "url": "https://media.graphcms.com/ge4WdfTQ8Koo8oPxkJlB",
        },
      },
    ];
    return render_template('index.html', articles=articles, counter=COUNTER, url=request.url, printable=False), 404

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)