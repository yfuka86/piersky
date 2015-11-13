class Team < ActiveRecord::Base
  has_many :user_teams, dependent: :destroy
  has_many :users, through: :user_teams

  has_many :invitations, dependent: :destroy
  has_many :integrations, dependent: :destroy

  scope :by_user, ->(user) { by_user_id(user.id) }
  scope :by_user_id, ->(user_id) { joins(:user_teams).where('user_teams.user_id = ?', user_id) }

  class << self
    def send_daily_summary
      self.find_each do |team|
        team.user_teams.each do |user_team|
          if user_team.user.email == 'yuta@piersky.com'
            mail = SummaryMailer.daily_mail(user_team.id).deliver_later
          end
        end
      end
    end

    def send_weekly_summary
      self.find_each do |team|
        team.user_teams.each do |user_team|
          return if user_team.user.email != 'yuta@piersky.com'
          mail = SummaryMailer.weekly_mail(user_team.id).deliver_later
        end
      end
    end

    def setup(user, params={})
      team = self.new(params)
      team.users << user
      team.save!
    end
  end
end
