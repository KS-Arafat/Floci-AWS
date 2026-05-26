import boto3
from mypy_boto3_s3 import S3Client
from botocore.exceptions import ClientError
from tqdm import tqdm


class ProgressPercentage:
    def __init__(self, filename):
        self._filename = filename
        self._size = float(__import__("os").path.getsize(filename))
        self._seen = 0
        self._bar = tqdm(total=self._size, unit="B", unit_scale=True)

    def __call__(self, bytes_amount):
        self._seen += bytes_amount
        self._bar.update(bytes_amount)


s3: S3Client = boto3.client(
    "s3",
    endpoint_url="http://localhost:4566",
    aws_access_key_id="test",
    aws_secret_access_key="test",
)

# s3.create_bucket(Bucket="pybuc1")
# s3.create_bucket(Bucket="pybuc2")

size = 50 * 1024 * 1024  # 50 MB
with open("dump.tmp", "wb") as f:
    f.write(b"\0" * size)

FILE_NAME = "dump.tmp"

try:

    print("Listing buckets:")
    for bucket in s3.list_buckets()["Buckets"]:
        print(f" - {bucket['Name']}")
    try:
        s3.head_object(Bucket="pybuc1", Key=FILE_NAME)
    except ClientError as e:
        if e.response["Error"]["Code"] == "404":
            print("Object does not exist.")
        else:
            raise
    print("Uploading file...")
    s3.upload_file(
        FILE_NAME, "pybuc1", FILE_NAME, Callback=ProgressPercentage(FILE_NAME)
    )
    print("File uploaded successfully.")

    print("Copying file from pybuc1 to pybuc2...")
    copy_source = {"Bucket": "pybuc1", "Key": FILE_NAME}
    s3.copy_object(
        CopySource=copy_source,
        Bucket="pybuc2",
        Key=FILE_NAME,
    )
    print("File copied successfully.")

    print("Deleting file from pybuc1...")
    s3.delete_object(Bucket="pybuc1", Key=FILE_NAME)
    print("File deleted successfully.")

    print("Downloading file from pybuc2...")
    s3.download_file(
        "pybuc2", FILE_NAME, "downloaded.tmp", Callback=ProgressPercentage(FILE_NAME)
    )
    print("File downloaded successfully.")

    download_url = s3.generate_presigned_url(
        "get_object", Params={"Bucket": "pybuc2", "Key": FILE_NAME}, ExpiresIn=3600
    )
    print(f"Presigned Download URL for {FILE_NAME}: {download_url}")
    # there is also s3.generate_presigned_url but it's less
    # constrained but post can set size limits and
    # content type etc also for form uploads using post requests
    post_url = s3.generate_presigned_post(
        Bucket="pybuc2",
        Key=f"upload/{FILE_NAME}",
        ExpiresIn=3600,
        Fields={
            "Content-Type": "image/jpeg",
        },
        Conditions=[
            {
                "content-length-range": [2 * 1024 * 1024, 10 * 1024 * 1024]
            },  # 2MB to 10MB
        ],
    )
    print(f"Presigned Upload URL for {FILE_NAME}: {post_url}")

except ClientError as e:
    print(e)
# s3.delete_bucket(Bucket="pybuc1")
# s3.delete_bucket(Bucket="pybuc2")
