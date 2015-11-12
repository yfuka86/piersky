class GithubCommitActivity < ActiveRecord::Base
  belongs_to :commit, class_name: 'GithubCommit', foreign_key: :child_id
  belongs_to :activity, class_name: 'ActivityGithub', foreign_key: :parent_id
end