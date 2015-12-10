module Concerns::Activity
  extend ActiveSupport::Concern

  included do
    belongs_to :identity

    scope :by_integration, -> (integration) { where(identity_id: integration.identities.pluck(:id)) }
  end

  class_methods do
    def summary(integration)
      SkyModule.get_day_time_series(self.where(identity_id: integration.identities.pluck(:id)))
    end

    def daily_time_series(integration)
      SkyModule.get_hour_of_yesterday_series(self.where(identity_id: integration.identities.pluck(:id)))
    end

    def daily_summary(integration)
      # please override
      daily_time_series(integration)
    end

    def identity_summary(identity, range = SkyModule.yesterday_range)
      {}
    end

    def daily_count(identity)
      self.where(identity_id: identity.id, ts: SkyModule.yesterday_range).count
    end

    def oldest_ts(integration)
      self.by_integration(integration).order(ts: :asc).first.try(:ts)
    end

    def latest_ts(integration)
      self.by_integration(integration).order(ts: :desc).first.try(:ts)
    end

    def service_name
      self.name.split('Activity')[1]
    end

    def identity_class
      ('Identity' + service_name).constantize
    end

    def integration_class
      ('Integration' + service_name).constantize
    end
  end

  def summary_sentence
    # please override
  end
end
