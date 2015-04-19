'''
Created on Dec 24, 2014

@author: Alan Tai
'''

class KeyValuePairsGeneral():
    """ general key and value pair """
    def __init__(self):
        
        # deafult setting of crawler
        self.default_urls = [{u"title" : u"Pornhub",                        u"link" : u'http://www.pornhub.com'},
                             {u"title" : u"Xvideos",                        u"link" : 'http://www.xvideos.com'},
                             {u"title" : u"YouPorn",                        u"link" : u'http://www.youporn.com'},
                             {u"title" : u"xHamster",                    u"link" : 'http://www.xhamster.com'},
                             {u"title" : u"Redtube",                  u"link" : 'http://www.redtube.com'}]
        
        # query api
        self.wine_searcher_api = u'http://api.wine-searcher.com/wine-select-api.lml?Xkey=ggstcs871585&Xversion=5'
        
        # config. setting
        self.config_setting = {
                               'webapp2_extras.sessions': {'secret_key': 'b4RiUe~53WregEGF6437EGRTHTJh&u90u1$%Y$%~e0.+54=954094309fewt3i-AqFB!.*^OHS$u2cNwOQGG',  # secret key is just a combination of random character which is better to be unguessable; user can create whatever they want
                                                           'cookie_name' : 'gogistics-winever-session',
                                                           'session_max_age' : 86400,
                                                           'cookie_args' : {'max_age' : 86400,
                                                                            'httponly' : True},} 
                               }