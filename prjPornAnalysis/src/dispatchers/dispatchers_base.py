# -*- coding: utf-8 -*-
'''
Created on Dec 24, 2014

@author: Alan Tai
'''
from handlers.handler_webapp2_extra_auth import BaseHandler
from dictionaries.dict_key_value_pairs import KeyValuePairsGeneral
import jinja2, webapp2, logging

# jinja environment
jinja_environment = jinja2.Environment(loader=jinja2.FileSystemLoader('static/templates'))

# dict
dict_general = KeyValuePairsGeneral()

class QueryWineSearcherDispatcher(BaseHandler):
    def get(self):
        """ front page """
        template_values = {}
        template_values.update({'title' : 'Welcome to WINEver'})
        self.render_template("/front_page_container.html", template_values)
        
class IndexPageDispatcher(BaseHandler):
    def get(self):
        """ index page """
        template_values = {}
        template_values.update({"title" : "WINEver Index Page"})
        self.render_template("/index_page_container.html", template_values)
    
# configuration
config = dict_general.config_setting

# app
app = webapp2.WSGIApplication([
    webapp2.Route(r'/', QueryWineSearcherDispatcher, name='front_page'),
    webapp2.Route(r'/base/index', IndexPageDispatcher, name='index_page')
], debug=True, config=config)

# log
logging.getLogger().setLevel(logging.DEBUG)