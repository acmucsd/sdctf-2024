#![forbid(unsafe_code)]

use core::panic;
use std::io::{self, Read, Write};
use smallvec::SmallVec;

fn print_menu() {
    println!("Menu: ");
    println!("1. Add to do");
    println!("2. Mark as done");
    println!("3. Edit to do");
    println!("4. Show todo list");
    println!("5. Exit");
    print!("> ");
    io::stdout().flush().unwrap();
}

#[derive(Clone, Debug)]
#[repr(C)]
struct TodoItem {
    name: [u8; 0x10],
    content: Option<Vec<u8>>,
    finished: bool
}

fn read_int() -> u64 {
    let mut input = String::new();
    io::stdin()
        .read_line(&mut input)
        .expect("[ERROR] failed to read");
    input.trim().parse().expect("[ERROR] invalid input")
}

fn mark_as_done(v: &mut SmallVec<[Box<TodoItem>; 0]>, v2: &mut SmallVec<[Box<TodoItem>; 0]>) {
    println!("Input index: ");
    let mut input = String::new();
    std::io::stdin().read_line(&mut input).unwrap();
    
    let index_list: Vec<u64> = input.split(',')
        .map(|i| i.trim().parse().expect("[ERROR] invalid input"))
        .collect();
    if index_list.len() == 0 {
        panic!("[ERROR] invalid input");
    }

    println!("Input insert index: ");
    let mut insert_idx = read_int();
    insert_idx = if insert_idx > v2.len() as u64 {
        v2.len() as u64
    } else {
        insert_idx
    };

    for i in &index_list {
        if let Some(item) = v.get_mut(*i as usize) {
            item.finished = true;
        }
    }
    if index_list.len() == 1 {
        let item = v.remove(index_list[0] as usize);
        if insert_idx == v2.len() as u64 {
            v2.push(item);
        } else {
            v2.insert(insert_idx as usize, item);
        }
        return;
    }

    let iter = v
        .to_vec()
        .into_iter()
        .filter(|item| item.finished);
    v2.insert_many(insert_idx as usize, iter);
    v.retain(|item| !item.finished);
}

fn edit_to_do(v: &mut SmallVec<[Box<TodoItem>; 0]>) {
    println!("Input index: ");
    let index = read_int();
    if let Some(item) = v.get_mut(index as usize) {
        println!("Input new content: ");
        std::io::stdin().read(&mut item.content.as_mut().unwrap()).unwrap();
    } else {
        panic!("[ERROR] invalid index");
    }
}

fn add_to_do(v: &mut SmallVec<[Box<TodoItem>; 0]>) {
    let mut new_item = Box::new(TodoItem {
        name: [0 as u8; 0x10],
        content: None,
        finished: false
    });
    let fill = |v: &mut Vec<u8>, data: u8| {
        for iter in v.iter_mut() {
            *iter = data;
        }
    };
    println!("Input name: ");
    std::io::stdin().read(&mut new_item.name).unwrap();
    println!("Input content size: ");
    let size = read_int() as usize;
    new_item.content = Some(vec![0x41 as u8; size]);
    println!("Input content: ");
    fill(new_item.content.as_mut().unwrap(), 0);
    std::io::stdin().read(&mut new_item.content.as_mut().unwrap()).unwrap();
    v.push(new_item);
}

fn print_list(v: &SmallVec<[Box<TodoItem>; 0]>) {
    for (i, item) in v.iter().enumerate() {
        print!("[{:02x}]: ", i);
        print!("name: ");
        std::io::stdout().write(&item.name).unwrap();
        println!();
        print!("      content: ");
        std::io::stdout().write(&item.content.as_ref().unwrap()).unwrap();
        println!();
        println!("      finished: {}", item.finished);
    }
}

fn print_banner() {
    println!("\n \
  _____ _______ ____  _____   ____  _      _____  _____ _______     \n\
 |  __ \\__   __/ __ \\|  __ \\ / __ \\| |    |_   _|/ ____|__   __|\n\
 | |__) | | | | |  | | |  | | |  | | |      | | | (___    | |       \n\
 |  _  /  | | | |  | | |  | | |  | | |      | |  \\___ \\   | |     \n\
 | | \\ \\  | | | |__| | |__| | |__| | |____ _| |_ ____) |  | |     \n\
 |_|  \\_\\ |_|  \\____/|_____/ \\____/|______|_____|_____/   |_|      ");
}

fn main() {
    print_banner();
    let mut todolist: SmallVec<[Box<TodoItem>; 0]> = SmallVec::new();
    let mut finished: SmallVec<[Box<TodoItem>; 0]> = SmallVec::new();
    loop {
        print_menu();
        let choice = read_int();
        match choice {
            1 => add_to_do(&mut todolist),
            2 => mark_as_done(&mut todolist, &mut finished),
            3 => edit_to_do(&mut todolist),
            4 => {
                println!("Todo list: ");
                print_list(&todolist);
                println!("Finished list: ");
                print_list(&finished);
            },
            5 => break,
            _ => println!("[ERROR] invalid choice")
        }
    }
}
