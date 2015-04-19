'''
Created on Dec 24, 2014

@author: Alan Tai
'''
from google.appengine.ext import ndb

class PornLink(ndb.Model):
    link = ndb.StringProperty()
    title = ndb.StringProperty(required = False)
    
    create_datetime = ndb.DateTimeProperty(auto_now_add = True)
    update_datetime = ndb.DateTimeProperty(auto_now = True)
    
    
class WebLinkRoot(PornLink):
    pass

class WebLinkPorn(PornLink):
    pass

class WebLinkPornTemp(PornLink):
    pass

class Tag(ndb.Expando):
    pass