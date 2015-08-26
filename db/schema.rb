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

ActiveRecord::Schema.define(version: 20150825170018) do

  create_table "activities", force: :cascade do |t|
    t.string   "type",           limit: 255, null: false
    t.integer  "integration_id", limit: 4
    t.integer  "identity_id",    limit: 4
    t.datetime "created_at",                 null: false
    t.datetime "updated_at",                 null: false
  end

  add_index "activities", ["identity_id"], name: "index_activities_on_identity_id", using: :btree
  add_index "activities", ["integration_id"], name: "index_activities_on_integration_id", using: :btree

  create_table "identities", force: :cascade do |t|
    t.integer  "user_id",     limit: 4
    t.integer  "team_id",     limit: 4
    t.string   "type",        limit: 255, null: false
    t.string   "primary_key", limit: 255, null: false
    t.datetime "created_at",              null: false
    t.datetime "updated_at",              null: false
  end

  add_index "identities", ["team_id"], name: "index_identities_on_team_id", using: :btree
  add_index "identities", ["user_id"], name: "index_identities_on_user_id", using: :btree

  create_table "integration_settings", force: :cascade do |t|
    t.integer "integration_id", limit: 4
    t.string  "webhook_token",  limit: 255
  end

  add_index "integration_settings", ["integration_id"], name: "index_integration_settings_on_integration_id", using: :btree
  add_index "integration_settings", ["webhook_token"], name: "index_integration_settings_on_webhook_token", unique: true, using: :btree

  create_table "integration_webhooks", force: :cascade do |t|
    t.integer "integration_id", limit: 4
    t.string  "uid",            limit: 255
    t.string  "name",           limit: 255
    t.string  "external_uid",   limit: 255
  end

  add_index "integration_webhooks", ["integration_id"], name: "index_integration_webhooks_on_integration_id", using: :btree
  add_index "integration_webhooks", ["uid"], name: "index_integration_webhooks_on_uid", unique: true, using: :btree

  create_table "integrations", force: :cascade do |t|
    t.integer  "user_id",    limit: 4
    t.integer  "team_id",    limit: 4
    t.string   "type",       limit: 255, null: false
    t.string   "token",      limit: 255
    t.string   "secret",     limit: 255
    t.datetime "created_at",             null: false
    t.datetime "updated_at",             null: false
  end

  add_index "integrations", ["team_id"], name: "index_integrations_on_team_id", using: :btree

  create_table "invitations", force: :cascade do |t|
    t.integer  "invitee_id",  limit: 4,   null: false
    t.integer  "inviter_id",  limit: 4,   null: false
    t.integer  "team_id",     limit: 4,   null: false
    t.datetime "sent_at"
    t.datetime "accepted_at"
    t.string   "token",       limit: 255
    t.datetime "created_at",              null: false
    t.datetime "updated_at",              null: false
  end

  create_table "slack_activities", force: :cascade do |t|
    t.string   "user_id",    limit: 50,  default: "", null: false
    t.string   "channel",    limit: 50,               null: false
    t.string   "ts",         limit: 50,  default: "", null: false
    t.string   "message",    limit: 100, default: "", null: false
    t.datetime "created_at",                          null: false
    t.datetime "updated_at",                          null: false
  end

  create_table "teams", force: :cascade do |t|
    t.string   "name",       limit: 255, default: "", null: false
    t.datetime "created_at",                          null: false
    t.datetime "updated_at",                          null: false
  end

  create_table "user_teams", force: :cascade do |t|
    t.integer  "user_id",       limit: 4,                 null: false
    t.integer  "team_id",       limit: 4,                 null: false
    t.boolean  "is_logging_in",           default: false, null: false
    t.integer  "role",          limit: 4, default: 0,     null: false
    t.datetime "created_at",                              null: false
    t.datetime "updated_at",                              null: false
  end

  add_index "user_teams", ["user_id", "team_id"], name: "index_user_teams_on_user_id_and_team_id", unique: true, using: :btree

  create_table "users", force: :cascade do |t|
    t.string   "email",                  limit: 255, default: "", null: false
    t.string   "encrypted_password",     limit: 255, default: "", null: false
    t.string   "reset_password_token",   limit: 255
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          limit: 4,   default: 0,  null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip",     limit: 255
    t.string   "last_sign_in_ip",        limit: 255
    t.string   "confirmation_token",     limit: 255
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.string   "unconfirmed_email",      limit: 255
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "users", ["confirmation_token"], name: "index_users_on_confirmation_token", unique: true, using: :btree
  add_index "users", ["email"], name: "index_users_on_email", unique: true, using: :btree
  add_index "users", ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true, using: :btree

  add_foreign_key "integration_settings", "integrations"
  add_foreign_key "integration_webhooks", "integrations"
end
