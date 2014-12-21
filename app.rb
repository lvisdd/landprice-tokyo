# -*- coding: utf-8 -*-
require 'rubygems'
require 'sinatra'
require 'sinatra/reloader'

get '/' do
  redirect '/2014'
end

get %r{/(\d{4})} do |year|
  erb :index
end
