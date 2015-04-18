'''
Created on Dec 24, 2014

@author: Alan Tai
'''

class KeyValuePairsGeneral():
    """ general key and value pair """
    def __init__(self):
        
        # deafult setting of crawler
        self.default_urls = [{u"title" : u"K&L",                        u"link" : u'http://www.klwines.com'},
                             {u"title" : u"BenchMarkWine",              u"link" : 'https://www.benchmarkwine.com'},
                             {u"title" : u"WineBid", "link" :           u'http://www.winebid.com'},
                             {u"title" : u"BelmontWine",                u"link" : 'http://www.belmontwine.com'},
                             {u"title" : u"The Wine Club",              u"link" : 'http://www.thewineclub.com'},
                             {u"title" : u"Aabalat Fine and Rare Wine", u"link" : "https://aabalat.com"},
                             {u"title" : u"Rare Wine Co.",              u"link" : "http://www.rarewineco.com"}]
        
        # query api
        self.wine_searcher_api = u'http://api.wine-searcher.com/wine-select-api.lml?Xkey=ggstcs871585&Xversion=5'
        
        # config. setting
        self.config_setting = {
                               'webapp2_extras.sessions': {'secret_key': 'b4RiUe~53!kGt3t34ty5y5-5&u90u1$%Y$%~e0.+54=954094309fewt3i-AqFB!.*^OHS$u2cNwOQGG',  # secret key is just a combination of random character which is better to be unguessable; user can create whatever they want
                                                           'cookie_name' : 'gogistics-winever-session',
                                                           'session_max_age' : 86400,
                                                           'cookie_args' : {'max_age' : 86400,
                                                                            'httponly' : True},} 
                               }