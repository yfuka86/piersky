module DeviseHelper
  EMAIL_EXAMPLE = 'name@domain.com'
  PASSWORD_EXAMPLE = 'password'

  def devise_error_messages!
    return "" if !defined?(resource) || resource.try(:errors).blank?

    html = ""
    messages = resource.errors.full_messages.each do |errmsg|
      html += <<-EOF
      <div class='message'>
        #{errmsg}
      </div>
      EOF
    end
    html.html_safe
  end

  def devise_error_messages?
    defined?(resource) && resource.try(:errors).present? ? true : false
  end

end