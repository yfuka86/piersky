class Api::BaseController < ApplicationController
  before_action :authenticate_user!
  before_action :set_timezone

  rescue_from Exception, with: :render_error
  rescue_from ActionView::MissingTemplate, with: :render_not_found

  def render_success(message='')
    @_success = true
    render(
        json: {success: true, message: message},
        status: 200
    )
  end

  def render_error(error, options = {})
    message = ''
    messages = nil
    if error.is_a?(Exception)
      message = error.message
      ExceptionNotifier.notify_exception(error)
    elsif error.is_a?(Array)
      messages = error
    elsif error.is_a?(Hash)
      message = error[:message]
    elsif error.is_a?(String)
      message = error
    end

    status = options[:status] || :internal_server_error
    render(
      json: {errors: messages, error: message},
      status: status
    )
  end

  def render_not_found(e = nil)
    render(
        json: {message: I18n.t(:not_found)},
        status: :not_found
    )
    ExceptionNotifier.notify_exception(e) if e
  end

  def authenticate_user!
    if valid_user.blank?
      render(
        json: {error: I18n.t(:unauthorized)},
        status: :unauthorized
      )
    end
  end

  private

  def valid_user
    return @_user ||= current_user
  end

  def valid_team
    return @_team ||= current_user.current_team
  end

  def set_timezone
    @timezone = params[:timezone].presence || 0
  end
end