extends RigidBody3D

## Amount of vertical force applied during motion
@export_range(750.0, 3000.0) var thrust: float = 1000.0

## Amount of torque applied during motion
@export var torque_thrust: float = 100.0

var is_transitioning: bool = false

@onready var explosion_audio: AudioStreamPlayer = $ExplosionAudio
@onready var success_audio: AudioStreamPlayer = $SuccessAudio
@onready var rocket_audio: AudioStreamPlayer3D = $RocketAudio
@onready var booster_particles: GPUParticles3D = $BoosterParticles
@onready var left_booster_particles: GPUParticles3D = $LeftBoosterParticles
@onready var right_booster_particles: GPUParticles3D = $RightBoosterParticles

# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta: float) -> void:
	if Input.is_action_pressed("boost"):
		apply_central_force(basis.y * delta * thrust)
		booster_particles.emitting = true
		if !rocket_audio.playing:
			rocket_audio.play()
	else:
		booster_particles.emitting = false
		rocket_audio.stop()
		
	if Input.is_action_pressed("rotate_left"):
		right_booster_particles.emitting = true
		apply_torque(Vector3(0.0, 0.0, delta * torque_thrust))
	else:
		right_booster_particles.emitting = false

	if Input.is_action_pressed("rotate_right"):
		left_booster_particles.emitting = true
		apply_torque(Vector3(0.0, 0.0, -delta * torque_thrust))
	else:
		left_booster_particles.emitting = false


func _on_body_entered(body: Node) -> void:
	if is_transitioning == false:
		if "hazard" in body.get_groups():
			crash_sequence()
		if "goal" in body.get_groups():
			complete_level(body.file_path)

func crash_sequence() -> void :
	print("KABOOM!")
	set_process(false)
	is_transitioning = true
	explosion_audio.play()
	var tween = create_tween()
	tween.tween_interval(2.5)
	tween.tween_callback(get_tree().reload_current_scene)
	
	
func complete_level(next_level_file: String) -> void:
	print("You Win!")
	set_process(false)
	is_transitioning = true
	success_audio.play()
	var tween = create_tween()
	tween.tween_interval(2.5)
	tween.tween_callback(get_tree().change_scene_to_file.bind(next_level_file))
	
