// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::api::process::{Command, CommandEvent};
// use tauri::Manager;
// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
async fn invoke_python() -> String {
    println!("Rust Called");
    return "Hello, Rust!".to_string();
    // let (mut rx, child) = Command::new("backend").spawn().expect("Failed to spawn python");

    // let (mut rx, child) = Command::new("backend")
    //     .args(["hello"])
    //     .spawn()
    //     .expect("Failed to spawn python");

    // let mut result = String::new();
    // while let Some(event) = rx.recv().await {
    //     println!("Event: {:?}", event);
    //     if let CommandEvent::Stdout(line) = event {
    //         result = line.clone();
    //         println!("Python: {}", line);
    //         break; // Only lets python send one line. This is not ideal
    //     }
    // }

    // child.kill()
    //     .expect("Failed to kill child process. May already be dead?");

    // "result".to_string()
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, invoke_python])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

    // invoke_python();
}
