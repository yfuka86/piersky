class WelcomeController < WebBaseController
  skip_before_action :authenticate_user!, only: [:index]

  def index
    if current_user
      redirect_to webapp_path
    end
  end

end
