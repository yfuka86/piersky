# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20151007213000) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "activity_githubs", force: :cascade do |t|
    t.integer  "identity_id"
    t.datetime "ts"
    t.integer  "code"
    t.integer  "repository_id"
    t.integer  "issue_id"
    t.integer  "pull_request_id"
    t.string   "action",          limit: 20
    t.string   "ref"
  end

  add_index "activity_githubs", ["identity_id", "ts", "code"], name: "index_activity_githubs_on_identity_id_and_ts_and_code", using: :btree

  create_table "activity_slacks", force: :cascade do |t|
    t.integer  "identity_id"
    t.datetime "ts"
    t.string   "channel_id"
    t.string   "type"
    t.string   "message",      limit: 255
    t.text     "long_message"
  end

  add_index "activity_slacks", ["identity_id", "ts", "channel_id"], name: "index_activity_slacks_on_identity_id_and_ts_and_channel_id", using: :btree

  create_table "github_comments", force: :cascade do |t|
    t.integer  "activity_id"
    t.integer  "integration_id"
    t.string   "foreign_id"
    t.datetime "ts"
    t.string   "body"
    t.string   "url"
  end

  add_index "github_comments", ["activity_id", "integration_id"], name: "index_github_comments_on_activity_id_and_integration_id", using: :btree

  create_table "github_commits", force: :cascade do |t|
    t.integer  "activity_id"
    t.integer  "integration_id"
    t.string   "foreign_id"
    t.datetime "ts"
    t.string   "message"
    t.string   "url"
  end

  add_index "github_commits", ["activity_id", "integration_id"], name: "index_github_commits_on_activity_id_and_integration_id", using: :btree

  create_table "github_issues", force: :cascade do |t|
    t.integer  "integration_id"
    t.integer  "foreign_id"
    t.datetime "ts"
    t.integer  "number"
    t.string   "title"
    t.string   "state"
    t.string   "url"
  end

  add_index "github_issues", ["integration_id", "foreign_id"], name: "index_github_issues_on_integration_id_and_foreign_id", using: :btree

  create_table "github_pull_requests", force: :cascade do |t|
    t.integer  "integration_id"
    t.integer  "foreign_id"
    t.datetime "ts"
    t.integer  "number"
    t.string   "title"
    t.string   "state"
    t.string   "url"
  end

  add_index "github_pull_requests", ["integration_id", "foreign_id"], name: "index_github_pull_requests_on_integration_id_and_foreign_id", using: :btree

  create_table "github_repositories", force: :cascade do |t|
    t.integer "integration_id"
    t.integer "foreign_id"
    t.string  "full_name"
  end

  add_index "github_repositories", ["integration_id", "foreign_id"], name: "index_github_repositories_on_integration_id_and_foreign_id", using: :btree

  create_table "identities", force: :cascade do |t|
    t.integer  "user_team_id"
    t.string   "type",                           null: false
    t.string   "primary_key",                    null: false
    t.string   "secondary_key",  default: ""
    t.string   "email_key",      default: ""
    t.boolean  "is_verified",    default: false, null: false
    t.datetime "created_at",                     null: false
    t.datetime "updated_at",                     null: false
    t.integer  "integration_id",                 null: false
    t.string   "name"
  end

  add_index "identities", ["user_team_id", "type"], name: "index_identities_on_user_team_id_and_type", using: :btree

  create_table "integration_settings", force: :cascade do |t|
    t.integer "integration_id", null: false
    t.string  "webhook_token"
  end

  add_index "integration_settings", ["integration_id"], name: "index_integration_settings_on_integration_id", using: :btree
  add_index "integration_settings", ["webhook_token"], name: "index_integration_settings_on_webhook_token", unique: true, using: :btree

  create_table "integration_webhooks", force: :cascade do |t|
    t.integer "integration_id"
    t.string  "uid"
    t.string  "name"
    t.string  "external_uid"
  end

  add_index "integration_webhooks", ["integration_id"], name: "index_integration_webhooks_on_integration_id", using: :btree
  add_index "integration_webhooks", ["uid"], name: "index_integration_webhooks_on_uid", unique: true, using: :btree

  create_table "integrations", force: :cascade do |t|
    t.integer  "user_id"
    t.integer  "team_id"
    t.string   "type",                               null: false
    t.string   "label",      limit: 20, default: ""
    t.string   "token"
    t.string   "secret"
    t.datetime "created_at",                         null: false
    t.datetime "updated_at",                         null: false
    t.integer  "status",                default: 0,  null: false
  end

  add_index "integrations", ["team_id"], name: "index_integrations_on_team_id", using: :btree

  create_table "invitations", force: :cascade do |t|
    t.integer  "invitee_id",  null: false
    t.integer  "inviter_id",  null: false
    t.integer  "team_id",     null: false
    t.datetime "sent_at"
    t.datetime "accepted_at"
    t.string   "token"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
  end

  create_table "slack_channels", force: :cascade do |t|
    t.integer  "integration_id"
    t.string   "foreign_id"
    t.datetime "ts"
    t.string   "name"
    t.string   "creator_id"
    t.boolean  "is_general"
  end

  add_index "slack_channels", ["integration_id", "foreign_id"], name: "index_slack_channels_on_integration_id_and_foreign_id", using: :btree

  create_table "slack_teams", force: :cascade do |t|
    t.integer "integration_id"
    t.string  "foreign_id"
    t.string  "name"
    t.string  "domain"
    t.string  "email_domain"
  end

  add_index "slack_teams", ["integration_id", "foreign_id"], name: "index_slack_teams_on_integration_id_and_foreign_id", using: :btree

  create_table "teams", force: :cascade do |t|
    t.string   "name",       default: "", null: false
    t.datetime "created_at",              null: false
    t.datetime "updated_at",              null: false
  end

  create_table "user_teams", force: :cascade do |t|
    t.integer  "user_id",                                  null: false
    t.integer  "team_id",                                  null: false
    t.string   "user_name",     limit: 20, default: "",    null: false
    t.boolean  "is_logging_in",            default: false, null: false
    t.integer  "role",                     default: 0,     null: false
    t.datetime "created_at",                               null: false
    t.datetime "updated_at",                               null: false
  end

  add_index "user_teams", ["user_id", "team_id"], name: "index_user_teams_on_user_id_and_team_id", unique: true, using: :btree

  create_table "users", force: :cascade do |t|
    t.string   "email",                  default: "", null: false
    t.string   "encrypted_password",     default: "", null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          default: 0,  null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.string   "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.string   "unconfirmed_email"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "users", ["confirmation_token"], name: "index_users_on_confirmation_token", unique: true, using: :btree
  add_index "users", ["email"], name: "index_users_on_email", unique: true, using: :btree
  add_index "users", ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true, using: :btree

  add_foreign_key "integration_settings", "integrations"
  add_foreign_key "integration_webhooks", "integrations"
end
