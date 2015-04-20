# -*- coding: utf-8 -*-
'''
Created on Dec 22, 2014

@author: Alan Tai
'''
from handlers.handler_webapp2_extra_auth import BaseHandler
from models.models_porn_info import WebLinkRoot, WebLinkPornTemp, WebLinkPorn,\
    Tag
from dictionaries.dict_key_value_pairs import KeyValuePairsGeneral
from bs4 import BeautifulSoup
import webapp2, logging, re, urllib2, urlparse
from datetime import datetime


#
dict_general = KeyValuePairsGeneral()

class TaskCrawlRootLinksDispatcher(BaseHandler):
    def get(self):
        self._read_feed()
    
    def _read_feed(self):
        """ crawling task """
        # temp root links
        root_list_temp = dict_general.default_urls
        
        # construct search list
        search_list = []
        query_root_entities = WebLinkRoot.query()
        if query_root_entities.count() > 0:
            for entity in query_root_entities:
                search_list.append({"title" : entity.title , "link" : entity.link})
        else:
            search_list = root_list_temp
            
        # start to crawl
        list_found_link = []
        while len(search_list) > 0:
            link = search_list.pop(0)["link"]
            parsed_str = urlparse.urlsplit(link)
            link_base = "{url_scheme}://{url_netloc}".format(url_scheme = parsed_str.scheme, url_netloc = parsed_str.netloc)
            
            
            try:
                req = urllib2.Request(link)
                response = urllib2.urlopen(req) # need to add new mechanism to prevent fetch javascript
                searched_page = response.read()
                soup = BeautifulSoup(searched_page)
                
                for found_link in soup.find_all('a'):
                    if found_link.get('href'):
                        match_group = re.match("http", found_link.get('href'), re.I)
                        full_href = ""
                        title = "NA"
                        
                        if not match_group:
                            full_href = "{href_link_base}{sub_href}".format(href_link_base = link_base, sub_href = found_link.get('href'))
                        else:
                            full_href = found_link.get('href')
                            
                        if found_link.contents and len(found_link.contents) > 0 and found_link.contents[0].string:
                            title = found_link.contents[0].string
                            
                        list_found_link.append({'title' : title, 'link' : full_href})
                        
            except urllib2.HTTPError, err:
                pass
                    
        
        # store result into db
        while len(list_found_link) > 0:
            new_link = list_found_link.pop(0)
            query = WebLinkPornTemp.query(WebLinkPornTemp.link == new_link['link'])
            if query.count() == 0:
                new_info = WebLinkPornTemp()
                new_info.link = new_link['link']
                new_info.title = new_link['title']
                new_info.put()
 

# crawl temp links
class TaskCrawlTempLinksDispatcher(BaseHandler):
    def get(self):
        # fetch entities from db
        entities = WebLinkPornTemp.query().fetch(15)
        search_list = []
        
        if entities:
            for entity in entities:
                search_list.append({'title' : entity.title, 'link' : entity.link})
                entity.key.delete()
        else:
            search_list = dict_general.default_urls
            
        # crawl website
        list_found_link = []
        while len(search_list) > 0:
            link = search_list.pop(0)['link']
            parsed_str = urlparse.urlsplit(link)
            link_base = "{url_scheme}://{url_netloc}".format(url_scheme = parsed_str.scheme, url_netloc = parsed_str.netloc)
            
            try:
                req = urllib2.Request(link)
                response = urllib2.urlopen(req) # need to add new mechanism to prevent fetch javascript
                searched_page = response.read()
                soup = BeautifulSoup(searched_page)
                
                for found_link in soup.find_all('a'):
                    if found_link.get('href'):
                        match_group = re.match("http", found_link.get('href'), re.I)
                        full_href = ""
                        title = "NA"
                        
                        if not match_group:
                            full_href = "{href_link_base}{sub_href}".format(href_link_base = link_base, sub_href = found_link.get('href'))
                        else:
                            full_href = found_link.get('href')
                            
                        if found_link.contents and len(found_link.contents) > 0 and found_link.contents[0].string:
                            title = found_link.contents[0].string
                            
                        list_found_link.append({'title' : title, 'link' : full_href})
            except urllib2.HTTPError, err:
                pass
                    
        # store result into db
        while len(list_found_link) > 0:
            new_link = list_found_link.pop(0)
            query = WebLinkPornTemp.query(WebLinkPornTemp.link == new_link['link'])
            if query.count() == 0:
                new_info = WebLinkPornTemp()
                new_info.link = new_link['link']
                new_info.title = new_link['title']
                new_info.put()
        
    

# categorize wine info
class TaskCategorizePornInfoDispatcher(BaseHandler):
    def get(self):
        """ cron task """
        self._categorize()
        
    def _categorize(self):
        """ categorize wine info """
        entities = WebLinkPornTemp.query().fetch(50) # to avoid running datastore free quota limit
        for entity in entities:
            result = re.findall(r"video\d+|redtube\.com\d+|videos\d+|watch\d+|viewkey=\d+", entity.link, re.I) # sku ; BuyWine/Item ; bwe
            query = WebLinkPorn.query(WebLinkPorn.link == entity.link)
            if result and query.count() == 0:
                new_wine_info = WebLinkPorn()
                new_wine_info.link = entity.link
                new_wine_info.title = entity.title
                new_wine_info.put()


class TaskCrawlTagInfo(BaseHandler):
    def get(self):
        base_url = 'http://www.xvideos.com/tags/'
        req = urllib2.Request(base_url)
        response = urllib2.urlopen(req) # need to add new mechanism to prevent fetch javascript
        searched_page = response.read()
        soup = BeautifulSoup(searched_page)
        
        for found_link in soup.find_all('a'):
            try:
                if found_link.get('href'):
                    match_group = re.match("/tags/.*", found_link.get('href'), re.I)
                    
                    if match_group:
                        tag_name = found_link.get('href')[found_link.get('href').rfind('/'):]
                        tag_number = str(found_link.previousSibling).strip()
                        tag_info = Tag( site = 'Xvideo',
                                        name = tag_name,
                                        number = tag_number,
                                        created_datetime = datetime.now())
                        
                        tag_info.put()
            except:
                pass

# configuration
config = dict_general.config_setting

# app
app = webapp2.WSGIApplication([
    webapp2.Route(r'/cron_tasks/crawl_root_links', TaskCrawlRootLinksDispatcher, name = 'crawl_root_links'),
    webapp2.Route(r'/cron_tasks/crawl_temp_links', TaskCrawlTempLinksDispatcher, name = 'crawl_temp_links'),
    webapp2.Route(r'/cron_tasks/categorize_porn_info', TaskCategorizePornInfoDispatcher, name = "categorize_wine_info"),
    webapp2.Route(r'/cron_tasks/crawl_tag_info', TaskCrawlTagInfo, name = 'crawl_tag_info')
], debug=True, config=config)

# log
logging.getLogger().setLevel(logging.DEBUG)