module Concerns::ActivityParent
  extend ActiveSupport::Concern

  included do
    has_many :activities, class_name: self::ACTIVITY_CLASS.name, foreign_key: self::FOREIGN_KEY
    belongs_to :integration, class_name: self::ACTIVITY_CLASS.integration_class, foreign_key: :integration_id
  end

  class_methods do
    def find_or_initialize(params, integration)
      params = parse(params, integration)
      raise if params[:foreign_id].blank?
      record = self.find_by(foreign_id: params[:foreign_id], integration_id: integration.id)
      record ||= self.new(params.merge({integration: integration}))
      record
    end

    def find_or_create!(params, integration)
      record = find_or_initialize(params, integration)
      record.save!
      record
    end

    def parse(params, integration)
      params
    end
  end
end
