class GithubRepository
  include Cequel::Record
  key :id, :int
  column :full_name, :text, index: true

  def self.find_or_create(params)
    repository = self.find_by_id(params["id"])
    repository = self.create(id: params["id"]) unless repository
    repository.full_name = params["full_name"] if repository.full_name != params["full_name"]
    repository.save!
    repository
  end
end