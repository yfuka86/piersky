class Api::GithubWrapperController < ApplicationController
  require_dependency 'integration/github'

  def index
    integration = Integration::Github.find_by(user: current_user)
    pull_requests = integration.pull_requests
    if params[:user] && params[:name]
        response = {user: params[:user], name: params[:name], pull_requests: pull_requests.all(params[:user],params[:name]).body}
    else
      response = integration.fetch_syncables.map{|str| str.split("/")}.map{ |user,name|
        {user: user,name: name,pull_requests: pull_requests.all(user,name).body}
      }
    end
    render json: response.to_json
  end
end
