from flask import Flask, render_template
from graphqlclient import GraphQLClient
import json, datetime

app = Flask(__name__);
app.static_folder = 'static'

COUNTER = 311475

client = GraphQLClient('https://api-eu-central-1.graphcms.com/v2/ckgi1a7duu2pu01xp02w993pr/master')

@app.route('/')
def default():
    global COUNTER
    query = '''
{
  articles(last: 5, where: {articleType: ogloszenia}) {
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
    COUNTER += 1
    return render_template('index.html', articles=res['articles'], counter=COUNTER)

@app.route('/ogloszenia/ostatnie')
def announcements_lates():
    query = '''
{
  articles(last: 5, where: {articleType: ogloszenia}) {
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
    return render_template('index.html', articles=res['articles'], counter=COUNTER)

@app.route('/ogloszenia/<date>')
def announcements_by_date(date):
    query = '''
{
  articles(last: 5, where: {articleType: ogloszenia, date: "%s"}) {
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
    ''' % (date)
    res = json.loads(client.execute(query))['data']
    return render_template('index.html', articles=res['articles'], counter=COUNTER)

@app.route('/aktualnosci')
def news():
    query = '''
{
  articles(last: 5, where: {articleType: aktualnosci}) {
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
    return render_template('index.html', articles=res['articles'], counter=COUNTER)

@app.route('/kancelaria')
def office():
    query = '''
{
  articles(last: 1, where: {articleType: kancelaria } ) {
    title
    content {
      html
    }
  }
}
    '''
    res = json.loads(client.execute(query))['data']
    return render_template('index.html', articles=res['articles'], counter=COUNTER)

@app.route('/cmentarz')
def cementary():
    query = '''
{
  articles(last: 1, where: {articleType: cmentarz } ) {
    title
    content {
      html
    }
  }
}
    '''
    res = json.loads(client.execute(query))['data']
    return render_template('index.html', articles=res['articles'], counter=COUNTER)

@app.route('/msze-swiete')
def mass():
    query = '''
{
  articles(last: 1, where: {articleType: msze } ) {
    title
    content {
      html
    }
  }
}
    '''
    res = json.loads(client.execute(query))['data']
    return render_template('index.html', articles=res['articles'], counter=COUNTER)

@app.route('/sakramenty')
def sacraments():
    query = '''
{
  articles(last: 1, where: {articleType: sakramenty } ) {
    title
    content {
      html
    }
  }
}
    '''
    res = json.loads(client.execute(query))['data']
    return render_template('index.html', articles=res['articles'], counter=COUNTER)

@app.route('/informacje')
def info():
    query = '''
{
  articles(last: 1, where: {articleType: informacje } ) {
    title
    content {
      html
    }
  }
}
    '''
    res = json.loads(client.execute(query))['data']
    return render_template('index.html', articles=res['articles'], counter=COUNTER)


@app.route('/ministranci')
def acolyte():
    query = '''
{
  articles(last: 1, where: {articleType: ministranci } ) {
    title
    content {
      html
    }
  }
}
    '''
    res = json.loads(client.execute(query))['data']
    return render_template('index.html', articles=res['articles'], counter=COUNTER)

@app.route('/najswietsze-serce-jezusa')
def nsj():
    query = '''
{
  articles(last: 1, where: {articleType: nsj } ) {
    title
    content {
      html
    }
  }
}
    '''
    res = json.loads(client.execute(query))['data']
    return render_template('index.html', articles=res['articles'], counter=COUNTER)

@app.route('/polecane-strony')
def pages():
    query = '''
{
  articles(last: 1, where: { articleType: strony } ) {
    title
    content {
      html
    }
  }
}
    '''
    res = json.loads(client.execute(query))['data']
    return render_template('index.html', articles=res['articles'], counter=COUNTER)

@app.route('/wspolnoty-parafialne')
def groups():
    query = '''
{
  articles(last: 1, where: { articleType: wspolnoty } ) {
    title
    content {
      html
    }
  }
}
    '''
    res = json.loads(client.execute(query))['data']
    return render_template('index.html', articles=res['articles'], counter=COUNTER)

@app.route('/wspolnoty-parafialne/<_type>')
def group(_type):
    query = '''
{
  groupDescripions(last: 1, where: { groupType: %s }) {
    title
    content {
      html
    }
  }
}
    ''' % (_type)
    res = json.loads(client.execute(query))['data']
    return render_template('index.html', articles=res['groupDescripions'], counter=COUNTER)

@app.errorhandler(Exception)
def page_not_found(e):
    articles = [
      {
        "title": "Nieznaleziono, 404",
        "content": {
          "html":
            "<p>Strona, której szukasz nie została znaleziona. <a class='link' href='/'>Wróć do strony głównej</a></p>",
        },
        "date": datetime.datetime.now().strftime('%d-%m-%Y'),
        "image": {
          "url": "https://media.graphcms.com/1twgYLsySMqYNSi8q5Ms",
        },
      },
    ];
    return render_template('index.html', articles=articles, counter=COUNTER), 404


if __name__ == '__main__':
    app.run()