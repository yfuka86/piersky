class GithubRepository
  include Cequel::Record
  key :id, :int
  column :full_name, :text, index: true

  def self.find_or_create(params)
    repository = self[params["id"]].take(1)
    repository = self.create(id: params["id"]) unless repository
    if repository.full_name != params["full_name"]
      repository.full_name = params["full_name"]
      repository.save!
    end
    repository
  end
end