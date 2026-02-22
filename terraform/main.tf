#1.Tell Terraform we are using aws
terraform{
    required_providers{
        aws={
            source="hashicorp/aws"
            version="~>5.0"
        }
    }
}

#2.Set your AWS Region
provider "aws"{
    region="us-east-1"
}

#3.Automatically find the latest Ubuntu 22.04 image
data "aws_ami" "ubuntu"{
    most_recent=true
    owners     =["099720109477"]

filter{
    name= "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
}
filter{
    name   = "virtualization-type"
    values = ["hvm"]
}
}

# 4. Create the Security Group (The Firewall)
resource "aws_security_group" "pizza_sg"{
    name= "pizza-k3s-sg"
    description="Allow web,SSH, and K3s traffic"


#Allow SSH from anywhere (so Ansible can log in later)
ingress{
    from_port = 22
    to_port = 22
    protocol= "tcp"
    cidr_blocks = ["0.0.0.0/0"]
}

#Allow HTTP web traffic (so users can see your donute bakery )
ingress{
    from_port = 80
    to_port = 80
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
}

# Allow K3s Kubernetes API traffic (so you can control the cluster)
  ingress {
    from_port   = 6443
    to_port     = 6443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

# Allow all outbound traffic (so the server can download Docker/K3s)
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_key_pair" "pizza_auth" {
    key_name = "pizza-fly-key"
    public_key = "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIN3HT+rcpwk7QJU9s24/j+N96AQxGwa+PikneSsHOPm3 nisa@DESKTOP-CE19CGT"
}

#5. Create the EC2 server
resource "aws_instance" "k3s_server"{
    ami = data.aws_ami.ubuntu.id
    instance_type = "t3.medium"
    key_name = aws_key_pair.pizza_auth.key_name


    # Attach the firewall we created above
  vpc_security_group_ids = [aws_security_group.pizza_sg.id]

  # Name the server in your AWS console
  tags = {
    Name = "Pizza-K3s-Node"
  }
}

#print the server's IP address
output "server_public_ip" {
    value = aws_instance.k3s_server.public_ip
}
