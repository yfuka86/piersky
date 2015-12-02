class WelcomeController < WebBaseController
  layout 'welcome'
  skip_before_action :authenticate_user!, only: [:index]

  def index
    if current_user && current_user.current_team
      if current_user.current_team.integrations.count > 0
        redirect_to webapp_path
      else
        redirect_to webapp_path(path: "integrations/new")
      end
    end
  end

end
