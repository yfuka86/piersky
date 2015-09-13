class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.

  # if !Rails.env.development?
  #   rescue_from Exception,                        with: :render_500
  #   rescue_from ActiveRecord::RecordNotFound,     with: :render_404
  #   rescue_from ActionController::RoutingError,   with: :render_404
  # end

  def routing_error
    raise ActionController::RoutingError.new(params[:path])
  end

  def render_404(e = nil)
    logger.info "Rendering 404 with exception: #{e.message}" if e

    if request.xhr?
      render json: { error: '404 error' }, status: 404
    else
      format = params[:format] == :json ? :json : :html
      render template: 'errors/error_404', formats: format, status: 404, layout: 'application', content_type: 'text/html'
    end
    ExceptionNotifier.notify_exception(e) if e
  end

  def render_500(e = nil)
    logger.info "Rendering 500 with exception: #{e.message}" if e

    if request.xhr?
      render json: { error: '500 error' }, status: 500
    else
      format = params[:format] == :json ? :json : :html
      render template: 'errors/error_500', formats: format, status: 500, layout: 'application', content_type: 'text/html'
    end
    ExceptionNotifier.notify_exception(e) if e
  end
end
