import secrets
import string


def generate_api_key(length=32):
    """
    Generates a secure API key.

    Parameters:
    length (int): Length of the API key (default is 32).

    Returns:
    str: A securely generated API key.
    """
    characters = string.ascii_letters + string.digits
    api_key = ''.join(secrets.choice(characters) for _ in range(length))
    return api_key

if __name__ == "__main__":
    key_length = 32  # You can change this length as needed
    api_key = generate_api_key(key_length)
    print(f"Generated API Key: {api_key}")