module Concerns::ActivityChild
  extend ActiveSupport::Concern

  included do
    belongs_to :activity, class_name: self::ACTIVITY_CLASS.name, foreign_key: :activity_id
    belongs_to :integration, class_name: self::ACTIVITY_CLASS.integration_class, foreign_key: :integration_id
  end

  class_methods do
    def find_or_initialize(params, integration, activity)
      params = parse(params, integration)
      raise if params[:foreign_id].blank?
      record = self.find_by(foreign_id: params[:foreign_id], integration_id: integration.id)
      record ||= self.new()
      record.assign_attributes(params.merge({integration: integration, activity: activity}))
      record
    end

    def find_or_create!(params, integration, activity)
      record = find_or_initialize(params, integration, activity)
      record.save!
      record
    end

    def parse(params, integration)
      params
    end
  end
end
