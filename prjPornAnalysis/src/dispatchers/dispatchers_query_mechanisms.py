# -*- coding: utf-8 -*-
'''
Created on Dec 24, 2014

@author: Alan Tai
'''
from handlers.handler_webapp2_extra_auth import BaseHandler
from dictionaries.dict_key_value_pairs import KeyValuePairsGeneral
import jinja2, webapp2, logging, json, re, urllib2

# jinja environment
jinja_environment = jinja2.Environment(loader=jinja2.FileSystemLoader('static/templates'))

# dict
dict_general = KeyValuePairsGeneral()

class QueryWineSearcherDispatcher(BaseHandler):
    def post(self):
        """ query mechanism for wine searcher """
        query_wine_info = self.request.get('query_info')
        query_wine_info = re.sub(r'\s|-','+',query_wine_info)
        query_wine_info = urllib2.quote(query_wine_info.encode('iso-8859-1')) # Wine Searcher default encode standard
        query_wine_vintage = self.request.get('query_vintage')
        
        # query 1.
        # query_str = GLOBAL_VALUES.WINE_SEARCHER_API_KEY + "&Xformat=J" + "&Xwinename=" + "stag+leap+napa+usa" + "&Xvintage=" + "1999" + "&Xlocation=" + "&Xautoexpand=Y" + "&Xcurrencycode=usd" + "&Xkeyword_mode=X" + "&Xwidesearch=V";
        # average price of the wine
        query_str = dict_general.wine_searcher_api
        queries = u'''&Xformat={query_format}&Xautoexpand={query_autoexpand}&Xcurrencycode={query_currencycode}&Xkeyword_mode={query_keyword_mode}&Xwidesearch={query_widesearch}&Xwinename={query_winename}&Xvintage={query_vintage}'''.format(query_format = u'J',
                                                                                                                                                                                                                                               query_autoexpand = u'Y',
                                                                                                                                                                                                                                               query_currencycode = u'usd',
                                                                                                                                                                                                                                               query_keyword_mode = u'X',
                                                                                                                                                                                                                                               query_widesearch = u'V',
                                                                                                                                                                                                                                               query_winename = query_wine_info,
                                                                                                                                                                                                                                               query_vintage = query_wine_vintage)
        
        query_str += queries # final string
        
        wine_searcher_query = urllib2.Request(query_str)
        wine_searcher_query = wine_searcher_query
        wine_searcher_response = urllib2.urlopen(wine_searcher_query).read()
        
        # query 2.
        # nearest store selling the wine
        # http://api.wine-searcher.com/wine-select-api.lml?Xkey=ggstcs871585&Xversion=5&Xwinename=Yquem+Sauternes+Bordeaux+France&Xvintage=2000&Xcurrencycode=usd&Xkeyword_mode=A&Xlatitude=37.65239&Xlongitude=-122.41785&Xnearest=Y
        wine_searcher_nearest_selling_store_response = u"NA"
        if query_wine_vintage:
            query_nearest_selling_store_str = dict_general.wine_searcher_api
            query_nearest_selling_store = u'''&Xformat={query_format}&Xcurrencycode={query_currencycode}&Xkeyword_mode={query_keyword_mode}&Xlatitude={query_latitude}&Xlongitude={query_longitude}&Xnearest={query_nearest}&Xwinename={query_winename}&Xvintage={query_vintage}'''.format(query_format = "J",
                                                                                                                                                                                                                                                                                       query_currencycode = "usd",
                                                                                                                                                                                                                                                                                       query_keyword_mode = "A",
                                                                                                                                                                                                                                                                                       query_latitude = "37.65239",
                                                                                                                                                                                                                                                                                       query_longitude = "-122.41785",
                                                                                                                                                                                                                                                                                       query_nearest = "Y",
                                                                                                                                                                                                                                                                                       query_winename = query_wine_info,
                                                                                                                                                                                                                                                                                       query_vintage = query_wine_vintage)
            query_nearest_selling_store_str += query_nearest_selling_store
            wine_searcher_nearest_store_query = urllib2.Request(query_nearest_selling_store_str)
            wine_searcher_nearest_selling_store_response = urllib2.urlopen(wine_searcher_nearest_store_query).read()
        
        
        # query 3.
        # store selling the wine
        # http://api.wine-searcher.com/wine-select-api.lml?Xkey=ggstcs871585&Xversion=5&Xwinename=Yquem+Sauternes+Bordeaux+France&Xvintage=2000&Xautoexpand=Y&Xcurrencycode=usd&Xkeyword_mode=A&Xformat=J
        wine_searcher_selling_stores_response = u"NA"
        if query_wine_vintage:
            query_selling_stores_str = dict_general.wine_searcher_api
            query_selling_stores = u'''&Xformat={query_format}&Xcurrencycode={query_currencycode}&Xkeyword_mode={query_keyword_mode}&Xautoexpand={query_autoexpand}&Xwinename={query_wine_info}&Xvintage={query_wine_vintage}'''.format(query_format = "J",
                                                                                                                                                                              query_currencycode = "usd",
                                                                                                                                                                              query_keyword_mode = "A",
                                                                                                                                                                              query_autoexpand = "Y",
                                                                                                                                                                              query_wine_info = query_wine_info,
                                                                                                                                                                              query_wine_vintage = query_wine_vintage)
            query_selling_stores_str += query_selling_stores
            wine_searcher_selling_stores_query = urllib2.Request(query_selling_stores_str)
            wine_searcher_selling_stores_response = urllib2.urlopen(wine_searcher_selling_stores_query).read()
                                            
        ajax_response = {u"query_results" : wine_searcher_response.decode("iso-8859-1"),
                         u"query_nearest_selling_store" : wine_searcher_nearest_selling_store_response.decode("iso-8859-1"),
                         u"query_selling_stores" : wine_searcher_selling_stores_response.decode("iso-8859-1")}
        self.response.out.headers['Content-Type'] = 'text/json'
        self.response.out.write(json.dumps(ajax_response, ensure_ascii = False).encode('utf8'))

    
# configuration
config = dict_general.config_setting

# app
app = webapp2.WSGIApplication([
    webapp2.Route(r'/query/wine_searcher', QueryWineSearcherDispatcher, name='wine_searcher')
], debug=True, config=config)

# log
logging.getLogger().setLevel(logging.DEBUG)