module Concerns::ActivityRelated
  # for n to n relations
  extend ActiveSupport::Concern

  included do
    has_many :activity_relations, class_name: self::ACTIVITY_RELATION_CLASS.name, foreign_key: :child_id
    has_many :activities, through: :activity_relations
    belongs_to :integration, class_name: self::ACTIVITY_CLASS.integration_class, foreign_key: :integration_id
  end

  class_methods do
    def find_or_initialize(params, integration, activity)
      params = parse(params, integration)
      raise if params[:foreign_id].blank?
      record = self.find_by(foreign_id: params[:foreign_id], integration_id: integration.id)
      record ||= self.new(params.merge({integration: integration, activities: [activity]}))
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
