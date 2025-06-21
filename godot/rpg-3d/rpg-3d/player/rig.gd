extends Node3D
class_name Rig

@onready var animation_tree: AnimationTree = $AnimationTree

var run_path: String = "parameters/MoveSpace/blend_position"

func update_animation_tree(direction: Vector3) -> void:
	if direction.is_zero_approx():
		animation_tree[run_path] = -1.0
	else:
		animation_tree[run_path] = 1.0
