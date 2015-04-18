'''
Created on Dec 24, 2014

@author: Alan Tai
'''
from google.appengine.ext import ndb

class WebLink(ndb.Model):
    link = ndb.StringProperty()
    title = ndb.StringProperty(required = False)
    
    create_datetime = ndb.DateTimeProperty(auto_now_add = True)
    update_datetime = ndb.DateTimeProperty(auto_now = True)
    
    
class WebLinkRoot(WebLink):
    pass

class WebLinkWine(WebLink):
    pass

class WebLinkWineTemp(WebLink):
    pass