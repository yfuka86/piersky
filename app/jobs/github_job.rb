class GithubJob < ActiveJob::Base
  queue_as :default

  def perform(integration_id)
    # バグの温床になるのでとりあえずコメントアウト
    # ActiveRecord::Base.transaction do
    #   integration = IntegrationGithub.find_by(id: integration_id)
    #   webhooks = integration.webhooks.pluck(:name)
    #   client = integration.gh_client
    #   webhooks.each do |w|
    #     args = w.split('/')
    #     user = args[0]
    #     repo = args[1]
    #     repo_model = GithubRepository.find_or_create(client.repos.get(user: user, repo: repo), integration)

    #     page = 0
    #     latest_issue_id = GithubIssue.order(foreign_id: :desc).first
    #     loop do 
    #       issues = client.issues.list(user: user, repo: repo, state: 'all', page: page)
    #       issues.each do |i| 
    #         issue_model = GithubIssue.find_or_create(i, integration)
    #         issue_model.update(repository_id: repo_model.id)
    #         activity = AcitvityGithub.create(code: ActivityGithub::CODES[:issues], action: 'opened', ts: i.created_at, pull_request_id: issue_model.id)
    #       end

    #       break if issues[-1].id.to_i < latest_issue_id.to_i
    #       page += 1
    #     end

    #     page = 0
    #     latest_pr_id = GithubPullRequest.order(foreign_id: :desc).first
    #     loop do 
    #       prs = client.pull_requests.list(user: user, repo: repo, state: 'all', page: page)
    #       prs.each do |p| 
    #         pr_model = GithubPullRequest.find_or_create(p, integration)
    #         pr_model.update(repository_id: repo_model.id)
    #         activity = AcitvityGithub.create(code: ActivityGithub::CODES[:pr], action: 'opened', ts: p.created_at, pull_request_id: pr_model.id)
    #       end

    #       break if prs[-1].id.to_i < latest_pr_id.to_i
    #       page += 1
    #     end

    #   end

    #   integration.default!
    # end
  end
end
