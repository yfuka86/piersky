class ViaController < WebBaseController
  def mail
    redirect_to params[:url] || root_path
    Log.create(code: :mail, body: params[:url])
  end
end
