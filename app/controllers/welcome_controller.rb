class WelcomeController < WebBaseController
  layout 'welcome'
  skip_before_action :authenticate_user!, only: [:index]

  def index
    if current_user
      redirect_to webapp_path(path: 'integrations')
    end
  end

end
