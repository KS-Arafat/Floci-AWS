from utils.producer import publish_message
from utils.consumer import consume_message

publish_message(5)
try:
    consume_message()
except KeyboardInterrupt:
    print("Exiting...")
