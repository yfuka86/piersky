class GithubCommitActivity < ActiveRecord::Base
  belongs_to :github_commit
  belongs_to :activity_github
end