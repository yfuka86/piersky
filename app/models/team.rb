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
        next if team.integrations.blank?
        team.user_teams.each do |user_team|
          mail = SummaryMailer.daily(user_team.id).deliver_later
        end
      end
    end

    def test_send_daily_summary
      self.find_each do |team|
        next if team.integrations.blank?
        team.user_teams.each do |user_team|
          if user_team.user.email.in?(['yuta@piersky.com', 'yurimatsui37@gmail.com'])
            mail = SummaryMailer.daily(user_team.id).deliver_later
          end
        end
      end
    end

    def send_weekly_summary
      self.find_each do |team|
        team.user_teams.each do |user_team|
          if user_team.user.email.in?(['yuta@piersky.com', 'yurimatsui37@gmail.com'])
            mail = SummaryMailer.weekly(user_team.id).deliver_later
          end
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
