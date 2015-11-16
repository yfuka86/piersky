class GraphsController < WebBaseController
  skip_before_filter :verify_authenticity_token, :authenticate_user!, only: :show

  def index
  end
end
