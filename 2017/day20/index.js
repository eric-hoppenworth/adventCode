const fs = require("fs");

const parseInput = ()=>{
	fs.readFile("./puzzle.txt","utf8",function(err,data){
		let list = data.split("\r\n");
		let particles = [];
		//p=<-4897,3080,2133>, v=<-58,-15,-78>, a=<17,-7,0>
		for(let i = 0; i < list.length; i++){
			let vectors = list[i].split(">, ");
			//['p=<-4897,3080,2133', 'v=<-58,-15,-78', 'a=<17,-7,0>']
			let position = {};
			let temp = vectors[0].split(",")
			//['p=<-4897','3080','2133']
			position.x = parseInt( temp[0].split("<")[1] ,10);
			position.y = parseInt( temp[1] ,10);
			position.z = parseInt( temp[2] ,10);
			let velocity = {};
			temp = vectors[1].split(",")
			//['v=<-58','-15','-78']
			velocity.x = parseInt( temp[0].split("<")[1] ,10);
			velocity.y = parseInt( temp[1] ,10);
			velocity.z = parseInt( temp[2] ,10);
			let acceleration = {};
			temp = vectors[2].split(",")
			//['a=<17','-7','0>']
			acceleration.x = parseInt( temp[0].split("<")[1] ,10);
			acceleration.y = parseInt( temp[1] ,10);
			acceleration.z = parseInt( temp[2].split(">")[0] ,10);

			let myParticle = {
				position,
				velocity,
				acceleration
			};
			particles.push(myParticle);
		}
		fs.writeFile("./particles.txt",JSON.stringify(particles),(err,data)=>{console.log("done")});
	});
};

const move = (particle)=>{
	let result = {
		acceleration:{},
		velocity:{},
		position:{}
	};
	result.acceleration.x = particle.acceleration.x;
	result.acceleration.y = particle.acceleration.y;
	result.acceleration.z = particle.acceleration.z;

	result.velocity.x = particle.velocity.x + particle.acceleration.x;
	result.velocity.y = particle.velocity.y + particle.acceleration.y;
	result.velocity.z = particle.velocity.z + particle.acceleration.z;

	result.position.x = particle.position.x + result.velocity.x;
	result.position.y = particle.position.y + result.velocity.y;
	result.position.z = particle.position.z + result.velocity.z;
	return result;
};

const isCollided = (particle1, particle2)=>{
	let result = true;
	for(key in particle1.position){
		if(particle1.position[key] != particle2.position[key]){
			result = false;
		}
	}
	return result;
};

fs.readFile("./particles.txt","utf8",function(err,data){
	let particles = JSON.parse(data);
	let count = 0;

	while(count < 500){
		//move all particles
		for(let i = 0; i < particles.length; i++){
			particles[i] = move(particles[i]);
		}
		//then check for collisions
		let i = 0;
		while(i < particles.length - 1){
			let myParticle = particles[i];
			let collided = false;
			let j = i + 1;
			while(j < particles.length){
				if( isCollided(myParticle,particles[j]) ){
					particles.splice(j,1);
					collided = true;
				} else {
					j++;
				}
			}
			if(collided){
				particles.splice(i,1);
			}else{
				i++;
			}
		}
		count++;
	}
	console.log(particles.length);
});
