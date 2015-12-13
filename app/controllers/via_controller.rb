class ViaController < WebBaseController
  skip_before_action :authenticate_user!

  def mail
    redirect_to(params[:url] || root_path)
    Log.create(code: :mail, body: params[:url])
  end
end
