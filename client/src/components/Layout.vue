<template>
    <div class="min-h-screen flex flex-col">
        <header class="bg-gray-800 p-4 shadow-md">
            <h1 class="text-2xl font-bold text-center">🖧 Matrix Lobby Game</h1>
        </header>
        <main class="flex-1 p-6 overflow-auto">
            <slot />
        </main>
        <footer class="bg-gray-800 p-2 text-center text-sm">
            © 2025 Matrix Game • Todos os direitos reservados
        </footer>
    </div>
</template>