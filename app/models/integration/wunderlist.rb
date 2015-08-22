class Integration::Wunderlist < Integration

  def trigger_import(user)
    wl = ::Wunderlist::API.new({
      access_token: self.token,
      client_id: OMNIAUTH[:wunderlist][:key]
    })
    ActiveRecord::Base.transaction do
      team = self.team
      wl.lists.map do |list|
        project = team.projects.build
        project.assign_with_user(user, {title: list.title})
        list.tasks.each do |task|
          new_task = project.tasks.build
          new_task.assign_with_user(user, {title: task.title})
        end
        project.save!
        project
      end
      true
    end
  end
end