require 'faker'

team = Team.create(name: 'Piersky')

users = [
          ['test@piersky.com', 'languageGame89', 'Ludwig', 'Wittgenstein'],
          ['test2@piersky.com', 'déconst30', 'Jacques', 'Derrida'],
          ['test3@piersky.com', 'lightBulber', 'Thomas', 'Edison']].map do |ary|
  user = User.create(
          email: ary[0],
          password: 'testtest',
          confirmed_at: Time.now)
  UserTeam.create(
          team_id: team.id,
          user_id: user.id,
          user_name: ary[1],
          first_name: ary[2],
          last_name: ary[3],
          role: :owner)
  user
end
