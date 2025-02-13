extends RigidBody3D

## Amount of vertical force applied during motion
@export_range(750.0, 3000.0) var thrust: float = 1000.0

## Amount of torque applied during motion
@export var torque_thrust: float = 100.0

# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta: float) -> void:
	if Input.is_action_pressed("boost"):
		apply_central_force(basis.y * delta * thrust)
		
	if Input.is_action_pressed("rotate_left"):
		apply_torque(Vector3(0.0, 0.0, delta * torque_thrust))

	if Input.is_action_pressed("rotate_right"):
		apply_torque(Vector3(0.0, 0.0, -delta * torque_thrust))


func _on_body_entered(body: Node) -> void:
	if "hazard" in body.get_groups():
		print("You lose!")
	if "goal" in body.get_groups():
		print("You win!")
