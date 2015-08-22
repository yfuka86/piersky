class Api::GithubWrapperController < ApplicationController
  def index
      integration = Integration::Github.find_by(user: current_user)
      pull_requests = integration.gh_client.pull_requests
      if params[:user] && params[:name]
          binding.pry
          response = pull_requests.all(params[:user],params[:name]).body
      else
        response = integration.fetch_syncables.map{|str| str.split("/")}.map{ |user,name|
          pull_requests.all(user,name)
        }
        response = response.map{|res| res.body}
      end
      render json: response.to_json
  end
end
