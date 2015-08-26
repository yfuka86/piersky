class WebBaseController < ApplicationController
  protect_from_forgery with: :exception

  before_action :authenticate_user!

  private

  def current_team
    return @_team ||= current_user.current_team
  end
end